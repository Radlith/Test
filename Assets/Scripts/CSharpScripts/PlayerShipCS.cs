using UnityEngine;
using System.Collections;

public class PlayerShipCS : BaseHealthCS {

    
	public BaseProjectileCS pellet ;
	
	public float acceleration = 5;
	public float rotationspeed = 1;
	
	public float passivedrag = 0.05F;
	public float activedrag = 1;
	
	public float passiveangulardrag = 0.05F;
	public float activeangulardrag = 1;
	
	public float weaponCooldown = 1;
	public float weaponCooldownCountdown = 0;
	
	public float projectilespeed = 5;
	public float projectiledamage = 20;
	
	//public int burstcount = 1;
	//public var hpregen : float = 0;
  //Never actually got around to using those.
	
	private bool Paused = false;
	
	public override void Start () {
		rigidbody.constraints = RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;
		rigidbody.useGravity = false;
		
		base.Start();
	}
	
	public override void Update () {
	
		if(Input.GetKeyDown(KeyCode.Space))
		{
			if(Time.timeScale == 1)
			{
				Time.timeScale = 0;
				Paused = true;
			}
			else
			{
				Time.timeScale = 1;
				Paused = false;
			}
		}
		base.Update();
	}
	
	
	public void OnGUI()
	{
		if(Paused)
		{
					
			if(GUI.Button(new Rect(25,25,150,25), "POWER ("  + projectiledamage + ")" ))
			{
				projectiledamage *= 1.1F;
			}
			
			
			if(GUI.Button(new Rect(25, 50, 150, 25), "ROF (" + weaponCooldown + ")" ))
			{
				weaponCooldown *= 0.9F;
			}
			
			
      //if(GUI.Button(new Rect( 25, 75, 150, 25), "BURST (" + burstcount + ")"))
      //{
      //  burstcount += 1;
      //}
			
			if(GUI.Button(new Rect(25, 100, 150, 25), "BULLET SPEED (" + projectilespeed + ")"))
			{
				projectilespeed *= 1.1F;
			}
			
			if(GUI.Button(new Rect(25, 125, 150, 25), "ACCELERATION (" + acceleration + ")"))
			{
				acceleration *= 1.1F;
			}
			
      //if(GUI.Button(Rect(25, 150, 150, 25), "HP REGEN (" + hpregen + ")"))
      //{
      //  hpregen += 1;
      //}
		}
	}
	
	public void FixedUpdate()
	{
		OldControls();
	}

	//All physics based.  Turning and shooting an axial mounted weapon.  Probably throw in some variety of weapons or something.
	public void OldControls()
	{
		if(Input.GetAxis("Vertical") > 0.1)
		{
			rigidbody.AddRelativeForce(Vector3.forward * acceleration, ForceMode.Acceleration);
		}
		
		if(Input.GetAxis("Vertical") < -0.1)
		{
			rigidbody.drag = activedrag;
			rigidbody.angularDrag = activeangulardrag;
		}
		else if(rigidbody.drag > passivedrag)
		{
			rigidbody.drag = passivedrag;
			rigidbody.angularDrag = passiveangulardrag;
		}
		
		rigidbody.AddRelativeTorque(Vector3.up * rotationspeed * Input.GetAxis("Horizontal"));

    if(weaponCooldownCountdown > 0)
		{
			weaponCooldownCountdown -= Time.fixedDeltaTime;
			
		}
		
    if(Input.GetAxis("Fire1") > 0 && weaponCooldownCountdown <= 0)
    {
      FireProjectile();
    }

    //This way we get the actual ROF, provided the ROF isn't less than one frame
    if (weaponCooldownCountdown < 0) weaponCooldownCountdown = 0;

	}
	
	
	public void FireProjectile()
	{
    //Get facing, spawn projectiles
    weaponCooldownCountdown += weaponCooldown;

		if(pellet != null)
		{
			BaseProjectileCS blah;
			blah = (BaseProjectileCS) Instantiate(pellet, transform.position, transform.rotation);
			
			blah.colliderLayerMask = (1 << 0) |  (1 << LayerMask.NameToLayer("Enemy")); //Default layer and enemy layer
			//blah.rigidbody.AddForce(this.rigidbody.velocity + this.transform.forward * projectilespeed, ForceMode.VelocityChange);
			blah.velocity = this.transform.forward * projectilespeed;
			blah.damageValue = projectiledamage;
		}
	}

}
